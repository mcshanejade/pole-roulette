import type { Selection } from "@heroui/react";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

interface FeaturedMoveDropdownProps {
  setFeaturedMove: (value: string) => void; // Function to set the featured move state
  featuredMoveOptions: string[]; // Array of featured move options
}

export default function FeaturedMoveDropdown({
  setFeaturedMove,
  featuredMoveOptions,
}: FeaturedMoveDropdownProps) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  // Set the featured move state when the selected value changes
  React.useEffect(() => {
    setFeaturedMove(selectedValue);
  }, [selectedValue, setFeaturedMove]);

  // Clear selectedKeys when featuredMoveOptions changes
  React.useEffect(() => {
    setSelectedKeys(new Set([]));
  }, [featuredMoveOptions]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize"
          variant="bordered"
          endContent={selectedValue ? null : <ChevronDown />}
        >
          {selectedValue || "Select a Featured Move"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={setSelectedKeys}
      >
        {featuredMoveOptions.map((item) => (
          <DropdownItem key={item}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
