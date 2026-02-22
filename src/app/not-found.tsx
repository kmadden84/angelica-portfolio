import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-extrabold text-[var(--color-accent)] mb-4">
        404
      </p>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-[var(--color-text-tertiary)] mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-7 py-3 text-base font-semibold rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
