type WithLayers =
  | { layers: Array<number> }
  | {
      set layers(arg: number[]);
      get layers(): number[];
    };

/** @returns True when updated, false when not. */
export function addLayer(obj: WithLayers, newLayer: number): boolean {
  const updated = new Array<number>(...obj.layers);

  if (!updated.includes(newLayer)) {
    updated.push(newLayer);
    obj.layers = updated;
    return true;
  }

  return false;
}
