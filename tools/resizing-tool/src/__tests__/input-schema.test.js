import definitions from "../../public/inputs.json";
import starterDefinitions from "../../../../examples/componentStarter/inputs.json";

// Keep same-type definitions complete. Shortened definitions can render locally
// while leaving inconsistent object keys in the upload payload.
it("keeps input objects and definitions of each type consistent for upload", () => {
  const keys = (object) => Object.keys(object).sort();
  const shapes = new Map();
  for (const input of definitions) {
    expect(keys(input)).toEqual(keys(definitions[0]));
    if (!shapes.has(input.type)) shapes.set(input.type, keys(input.definition));
    expect({ tag: input.type, keys: keys(input.definition) }).toEqual({
      tag: input.type,
      keys: shapes.get(input.type),
    });
    for (const choice of input.definition.choices ?? []) {
      expect(keys(choice)).toEqual(["label", "value"]);
    }
  }
  const starter = definitions.find(
    (input) => input.tag === "componentStarterPlaceholderText"
  );
  expect(starterDefinitions[0].definition).toEqual(starter.definition);
});
