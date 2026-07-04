export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050816] px-6 text-center text-white">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-slate-400">
        Something went wrong while signing you in. Please try again.
      </p>
      <a href="/" className="text-cyan-400 hover:underline">
        Back to Home
      </a>
    </div>
  );
}