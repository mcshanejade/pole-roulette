import { Slider } from "@heroui/react";

interface MovesSliderProps {
  setNumMoves: (value: number) => void;
}

export default function MovesSlider({ setNumMoves }: MovesSliderProps) {
  return (
    <Slider
      classNames={{
        base: "max-w-md gap-3",
        track: "border-s-primary",
        filler: "bg-gradient-to-r from-primary to-secondary text-white",
        mark: "text-lg",
      }}
      renderThumb={(props) => (
        <div
          {...props}
          className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
        >
          <span className="transition-transform bg-gradient-to-r shadow-small from-pink-500 to-yellow-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
        </div>
      )}
      marks={[
        {
          value: 3,
          label: "3",
        },
        {
          value: 4,
          label: "4",
        },
        {
          value: 5,
          label: "5",
        },
        {
          value: 6,
          label: "6",
        },
      ]}
      color="primary"
      label="Number of Moves"
      hideValue={true}
      defaultValue={4}
      maxValue={6}
      minValue={3}
      showSteps={true}
      size="lg"
      step={1}
      onChangeEnd={(value) => setNumMoves(value as number)}
    />
  );
}
