import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-md shadow-primary/5">
        <FileQuestion className="w-8 h-8" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404 - Page Not Found
      </h1>
      
      <p className="mt-4 text-base text-muted-foreground max-w-md">
        Sorry, we couldn&apos;t find the recruitment pipeline page you were looking for. 
        It might have been moved or deleted.
      </p>
      
      <div className="mt-8">
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "default",
            size: "lg",
            className: "rounded-xl font-medium shadow-md shadow-primary/10",
          })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
