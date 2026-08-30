"use client";

import { Switch } from "@headlessui/react";
import { SectionKey } from "@/lib/sections";

/**
 * On/off switches for one section:
 *  - Active: off removes the section from the main menu
 *  - Paused: on keeps it in the menu but shows a "coming soon" veil
 */
export default function SectionSwitches({
  section,
  hidden,
  paused,
  disabled,
  onChange,
}: {
  section: SectionKey;
  hidden: boolean;
  paused: boolean;
  disabled: boolean;
  onChange: (section: SectionKey, key: "hidden" | "paused", value: boolean) => void;
}) {
  const switchClass = (on: boolean) =>
    `${on ? "bg-teal-500" : "bg-gray-300"} ${
      disabled ? "opacity-60 cursor-wait" : "cursor-pointer"
    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`;

  const knobClass = (on: boolean) =>
    `${on ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`;

  return (
    <div className="flex flex-col gap-2 pl-1">
      <div className="flex items-center gap-3">
        <Switch
          checked={!hidden}
          onChange={(value) => onChange(section, "hidden", !value)}
          disabled={disabled}
          className={switchClass(!hidden)}
        >
          <span className={knobClass(!hidden)} />
        </Switch>
        <span className="font-blurlight text-sm text-black">
          {hidden ? "Deactivated" : "Active"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={paused}
          onChange={(value) => onChange(section, "paused", value)}
          disabled={disabled}
          className={switchClass(paused)}
        >
          <span className={knobClass(paused)} />
        </Switch>
        <span className="font-blurlight text-sm text-black">
          {paused ? "Paused" : "Not paused"}
        </span>
      </div>
    </div>
  );
}
