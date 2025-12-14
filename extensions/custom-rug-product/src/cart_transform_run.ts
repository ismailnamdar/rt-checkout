import type {
  CartLine,
  CartTransformRunInput,
  CartTransformRunResult,
  LineUpdateOperation,
  Operation,
} from "../generated/api";

const NO_CHANGES: CartTransformRunResult = {
  operations: [],
};

export function cartTransformRun(
  input: CartTransformRunInput
): CartTransformRunResult {

  console.log('test running');
  const operations: Operation[] = input.cart.lines.reduce(
    (acc: Operation[], cartLine: CartLine) => {
      const updateOp = optionallyBuildLineUpdateOperation(cartLine);

      if (updateOp) {
        acc.push({ lineUpdate: updateOp });
      }
      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

function optionallyBuildLineUpdateOperation(cartLine: CartLine): LineUpdateOperation | undefined {
  const previewImage = cartLine.previewImage?.value;

  if (previewImage) {
    return {
      cartLineId: cartLine.id,
      title: "Your Custom Rug",
      image: {
        url: previewImage
      }
    } as LineUpdateOperation
  }

  return undefined;
}
