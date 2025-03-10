import { RadioGroup, useRadio, VisuallyHidden, cn } from "@heroui/react";
import { RadioProps } from "@heroui/react";

interface ComboLevelRadioProps {
  setLevel: (value: string) => void;
}

export const ComboLevelRadio: React.FC<RadioProps> = (props: RadioProps) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:border-primary hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

export default function RoutineRadioGroup({ setLevel }: ComboLevelRadioProps) {
  return (
    <RadioGroup
      label="Select your Experience Level"
      orientation="horizontal"
      defaultValue={"Beginner"}
      onValueChange={(value) => setLevel(value as string)}
    >
      <ComboLevelRadio
        description="The combo will only include beginner moves."
        value="Beginner"
      >
        Beginner
      </ComboLevelRadio>
      <ComboLevelRadio
        description="The combo will include intermediate as well as beginner moves."
        value="Intermediate"
      >
        Intermediate
      </ComboLevelRadio>
      <ComboLevelRadio
        description="The combo will include advanced as well as intermediate moves."
        value="Advanced"
      >
        Advanced
      </ComboLevelRadio>
    </RadioGroup>
  );
}
