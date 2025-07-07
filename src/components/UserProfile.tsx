import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";

export function UserProfile() {
  const user = useQuery(api.auth.loggedInUser);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-slate-800">
            {user.name || "Usuário"}
          </p>
          <p className="text-slate-500 text-xs">
            {user.email}
          </p>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}
