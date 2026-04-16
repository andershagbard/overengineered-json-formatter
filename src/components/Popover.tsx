import * as RadixPopover from '@radix-ui/react-popover';

export const Popover: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
}> = ({ trigger, children }) => {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          align="end"
          sideOffset={16}
          className="data-[state=closed]:animate-popover-out data-[state=open]:animate-popover-in border-ui-border/50 bg-ui-surface z-50 w-56 rounded-xl border p-4 shadow-xl outline-none"
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};
