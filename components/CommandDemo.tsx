import {
  AtomIcon,
  Book,
  BookIcon,
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Video,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandDemo() {
  return (
    <Command className="rounded-lg absolute left-18 top-18 border md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calculator />
            <span>Mathematics</span>
          </CommandItem>
          <CommandItem>
            <AtomIcon />
            <span>Physics</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Books">
          <CommandItem>
            <BookIcon />
            <span>Mathematics S1 PDF</span>
          </CommandItem>
          <CommandItem>
            <Book />
            <span>Physics S5 Book</span>
          </CommandItem>
          <CommandItem>
            <Book />
            <span>Entrepreneurship S2</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
