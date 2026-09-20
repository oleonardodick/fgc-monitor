import { CircleX, Info, TriangleAlert } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/merge";
import { Button, type ButtonProps } from "./Button";

const AlertDialog = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <div
      ref={ref}
      className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-center items-center"
      {...props}
    />
  ),
);

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <div
      ref={ref}
      className="flex flex-col rounded-lg border border-border bg-card text-card-foreground gap-3"
      role="dialog"
      aria-modal="true"
      {...props}
    />
  ),
);

const alertTypes = {
  Error: {
    icon: CircleX,
    className: "text-destructive",
  },
  Warning: {
    icon: TriangleAlert,
    className: "text-yellow-500",
  },
  Info: {
    icon: Info,
    className: "text-blue-500",
  },
} as const;

interface AlertDialogHeaderProps extends Omit<React.HTMLAttributes<HTMLHeadElement>, "children"> {
  type: "Error" | "Warning" | "Info";
  children: React.ReactNode;
}

const AlertDialogHeader = React.forwardRef<HTMLHeadElement, AlertDialogHeaderProps>(
  ({ type, children, ...props }, ref) => {
    const { icon: Icon, className: iconClassName } = alertTypes[type];

    return (
      <header className="flex gap-3 p-3" ref={ref} {...props}>
        <Icon className={cn("size-10 shrink-0", iconClassName)} />
        <div className="flex flex-col gap-2">{children}</div>
      </header>
    );
  },
);

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ ...props }, ref) => (
  <h2 ref={ref} className={"text-lg font-semibold leading-none tracking-tight"} {...props} />
));

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HtmlHTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => <p ref={ref} {...props} />);

const AlertDialogFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ ...props }, ref) => (
    <footer ref={ref} {...props} className="border-t p-3 flex gap-3 justify-end" />
  ),
);

type AlertDialogActionProps = ButtonProps;

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ ...props }, ref) => {
    return <Button ref={ref} {...props} />;
  },
);

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
};
