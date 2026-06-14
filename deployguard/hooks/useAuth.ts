import { useState, useEffect } from "react";
import { supabase, isRealSupabaseAvailable, isRealAuthAvailable, isPublishableKey, withAuthTimeout } from "@/lib/supabase";
import { LoginSchema, SignupSchema } from "@/lib/validations";
import { User, UserRole } from "@/types";

function sessionToUser(sessionUser: {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
}, fallbackRole: UserRole = "developer"): User {
  return {
    id: sessionUser.id,
    email: sessionUser.email || "",
    name: (sessionUser.user_metadata?.name as string) || sessionUser.email?.split("@")[0] || "User",
    role: (sessionUser.user_metadata?.role as UserRole) || fallbackRole,
    createdAt: sessionUser.created_at || new Date().toISOString(),
  };
}

function persistSession(user: User) {
  localStorage.setItem("deployguard_user", JSON.stringify(user));
  document.cookie = "deployguard_session=active; path=/; max-age=86400";
  document.cookie = `deployguard_role=${user.role}; path=/; max-age=86400`;
  document.cookie = `deployguard_user_id=${user.id}; path=/; max-age=86400`;
  document.cookie = `deployguard_user_email=${encodeURIComponent(user.email)}; path=/; max-age=86400`;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(sessionToUser(session.user));
        } else {
          const storedUser = localStorage.getItem("deployguard_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(sessionToUser(session.user));
      } else if (!localStorage.getItem("deployguard_user")) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, role: UserRole = "developer") => {
    setLoading(true);
    try {
      const parsed = LoginSchema.safeParse({ email, password });
      if (!parsed.success) {
        return { user: null, error: { message: parsed.error.issues[0].message } };
      }

      // Detect the wrong key format and fail fast with a clear message
      if (isPublishableKey) {
        return {
          user: null,
          error: {
            message:
              "Invalid Supabase API key. Go to Supabase Dashboard → Settings → API → " +
              "\"Legacy anon, service_role API keys\" section and copy the \"anon\" key " +
              "(starts with eyJhbGci...) into your .env file.",
          },
        };
      }

      let data: any = null;
      let error: any = null;
      try {
        const result = await withAuthTimeout(
          supabase.auth.signInWithPassword({ email, password }) as Promise<any>
        );
        data = result.data;
        error = result.error;
      } catch (timeoutErr: any) {
        if (timeoutErr?.message === 'SUPABASE_TIMEOUT') {
          return {
            user: null,
            error: { message: "Connection to Supabase timed out. Check your API key and Supabase project URL." },
          };
        }
        throw timeoutErr;
      }

      if (data?.session?.user) {
        const authUser = sessionToUser(data.session.user, role);
        persistSession(authUser);
        setUser(authUser);
        return { user: authUser, error: null };
      }

      if (error && isRealAuthAvailable) {
        // Surface the actual Supabase error (e.g. "Email not confirmed")
        return { user: null, error: { message: error.message } };
      }

      // Mock mode fallback (no valid Supabase key configured)
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split("@")[0],
        role,
        createdAt: new Date().toISOString(),
      };
      persistSession(mockUser);
      setUser(mockUser);
      return { user: mockUser, error: null };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Authentication failed";
      return { user: null, error: { message } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    name: string,
    password: string,
    role: UserRole,
    team: string = "Core Platform"
  ) => {
    setLoading(true);
    try {
      const parsed = SignupSchema.safeParse({ email, name, password, role, team });
      if (!parsed.success) {
        return { user: null, error: { message: parsed.error.issues[0].message }, needsEmailConfirmation: false };
      }

      // Detect wrong key format before attempting network call
      if (isPublishableKey) {
        return {
          user: null,
          error: {
            message:
              "Invalid Supabase API key. Go to Supabase Dashboard → Settings → API → " +
              "\"Legacy anon, service_role API keys\" and copy the \"anon\" key (eyJhbGci...) into your .env file.",
          },
          needsEmailConfirmation: false,
        };
      }

      // Build the redirect URL for email confirmation
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

      let data: any = null;
      let error: any = null;
      try {
        const result = await withAuthTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: { data: { name, role, team }, emailRedirectTo: redirectTo },
          }) as Promise<any>
        );
        data = result.data;
        error = result.error;
      } catch (timeoutErr: any) {
        if (timeoutErr?.message === 'SUPABASE_TIMEOUT') {
          return {
            user: null,
            error: { message: "Connection to Supabase timed out. Check your API key." },
            needsEmailConfirmation: false,
          };
        }
        throw timeoutErr;
      }

      if (error && isRealAuthAvailable) {
        return { user: null, error: { message: error.message }, needsEmailConfirmation: false };
      }

      if (data?.user && !error) {
        const needsConfirmation = isRealAuthAvailable && (
          !data.session ||
          (data.user.identities && data.user.identities.length === 0)
        );
        if (needsConfirmation) {
          return { user: null, error: null, needsEmailConfirmation: true };
        }
        const authUser = sessionToUser(data.user, role);
        authUser.name = name;
        persistSession(authUser);
        setUser(authUser);
        return { user: authUser, error: null, needsEmailConfirmation: false };
      }

      // Mock mode fallback
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      };
      persistSession(mockUser);
      setUser(mockUser);
      return { user: mockUser, error: null, needsEmailConfirmation: false };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Registration failed";
      return { user: null, error: { message }, needsEmailConfirmation: false };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("deployguard_user");
      document.cookie = "deployguard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "deployguard_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "deployguard_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "deployguard_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      await supabase.auth.signOut();
      setUser(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email.includes("@")) {
      return { error: { message: "Invalid email address" } };
    }
    const redirectTo = typeof window !== "undefined"
      ? `${window.location.origin}/auth/reset`
      : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error && isRealAuthAvailable) {
      return { error: { message: error.message } };
    }
    return { error: null };
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
