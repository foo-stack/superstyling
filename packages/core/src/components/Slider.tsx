import { type ComponentProps, type ReactNode } from "react";
import { Slider as TamaguiSlider } from "@tamagui/slider";

/**
 * Slider — value picker along a continuous range. Built on
 * `@tamagui/slider` which provides keyboard arrows, touch gestures, and
 * WAI-ARIA slider semantics.
 *
 *   <Slider value={[50]} onChange={([v]) => setV(v)} min={0} max={100}>
 *     <Slider.Track>
 *       <Slider.FilledTrack />
 *     </Slider.Track>
 *     <Slider.Thumb index={0} />
 *   </Slider>
 *
 * For two-thumb range selection, use `<RangeSlider>` — same internals,
 * different default value shape.
 */

export interface SliderProps {
  /** Value array — single-thumb uses `[v]`; range uses `[a, b]`. */
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onChangeEnd?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
  colorScheme?: string;
  children?: ReactNode;
}

function SliderRoot({
  value,
  defaultValue = [0],
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  orientation = "horizontal",
  isDisabled,
  children,
}: SliderProps) {
  return (
    <TamaguiSlider
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      onSlideEnd={onChangeEnd as never}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      disabled={isDisabled}
    >
      {children}
    </TamaguiSlider>
  );
}
SliderRoot.displayName = "Slider";

const SliderTrack = function SliderTrack(props: ComponentProps<typeof TamaguiSlider.Track>) {
  return <TamaguiSlider.Track backgroundColor="$color4" borderRadius={999} height={6} {...props} />;
};
SliderTrack.displayName = "Slider.Track";

const SliderFilledTrack = function SliderFilledTrack(
  props: ComponentProps<typeof TamaguiSlider.TrackActive>,
) {
  return <TamaguiSlider.TrackActive backgroundColor="$primary" {...props} />;
};
SliderFilledTrack.displayName = "Slider.FilledTrack";

const SliderThumb = function SliderThumb(props: ComponentProps<typeof TamaguiSlider.Thumb>) {
  return (
    <TamaguiSlider.Thumb
      size={20}
      circular
      backgroundColor="$background"
      borderWidth={2}
      borderColor="$primary"
      {...props}
    />
  );
};
SliderThumb.displayName = "Slider.Thumb";

export const Slider = Object.assign(SliderRoot, {
  Track: SliderTrack,
  FilledTrack: SliderFilledTrack,
  Thumb: SliderThumb,
});

/**
 * RangeSlider — two-thumb variant. Identical API surface; default value
 * becomes `[0, 100]`. Caller renders both thumbs with different indices.
 *
 *   <RangeSlider value={[20, 80]} onChange={setRange}>
 *     <RangeSlider.Track>
 *       <RangeSlider.FilledTrack />
 *     </RangeSlider.Track>
 *     <RangeSlider.Thumb index={0} />
 *     <RangeSlider.Thumb index={1} />
 *   </RangeSlider>
 */
function RangeSliderRoot(props: SliderProps) {
  return <SliderRoot defaultValue={[0, 100]} {...props} />;
}
RangeSliderRoot.displayName = "RangeSlider";

export const RangeSlider = Object.assign(RangeSliderRoot, {
  Track: SliderTrack,
  FilledTrack: SliderFilledTrack,
  Thumb: SliderThumb,
});
