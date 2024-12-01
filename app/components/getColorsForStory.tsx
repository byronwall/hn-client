import { orderBy, uniq } from "lodash";
import { HnItem, KidsObj3 } from "~/stores/useDataStore";

export function getColorsForStory(story: HnItem): Record<string, string> {
  // iterate through the comments and assign unique colors to each user
  // when assigning colors, avoid collisions on nearby comments and parents
  // map of user to color
  const hueMap: Record<string, number> = {};

  // first color is HN orange
  // assign the first color to the story author
  hueMap[story.by] = 30;

  let initialHue = Math.floor(Math.random() * 360);

  console.log("initialHue", initialHue);

  // if color is within 30 of the HN orange, shift it
  const delta = Math.abs(30 - initialHue);
  if (delta < 30) {
    initialHue = (initialHue + 30) % 360;
  }

  // start processing comments
  // assign colors to the first 3 top level comment authors
  // then go into the children and work those
  const initTopLevelComments = story.kidsObj?.slice(0, 3) || [];
  initTopLevelComments.filter(Boolean).forEach((comment, index) => {
    const hue = (initialHue + index * 120) % 360;

    hueMap[comment?.by || ""] = hue;
  });

  console.log("hueMap", { ...hueMap, initTopLevelComments });

  // now go into the children
  // keep track of the chain of hues being used
  // goal is to avoid collisions to any parent and immediate siblings
  // TODO: do the work
  processCommentsForObj(story.kidsObj || [], hueMap, []);

  console.log("final hue map", hueMap);

  // convert hue map to color map
  const colorMap: Record<string, string> = {};

  for (const user in hueMap) {
    const hue = hueMap[user];
    colorMap[user] = getRandHslForHue(hue);
  }

  return colorMap;
}
function processCommentsForObj(
  comments: (KidsObj3 | undefined | null)[],
  hueMap: Record<string, number>,
  parentHueChain: number[]
) {
  const siblingHues: number[] = [];

  let finalHue: number = 0;

  for (const comment of comments) {
    if (!comment || !comment.by) {
      continue;
    }

    // get hue for this comment
    // either existing author or best color that avoids current ones
    const currentHue =
      hueMap[comment.by] ??
      getColorThatAvoidsChain([...parentHueChain, ...siblingHues]);

    // store the hue
    hueMap[comment.by] = currentHue;

    // keep the last 3 sibling hues
    siblingHues.push(currentHue);
    if (siblingHues.length > 3) {
      siblingHues.shift();
    }

    // process children of this comment - will become recursive
    if (comment.kidsObj) {
      const finalChildHue = processCommentsForObj(comment.kidsObj, hueMap, [
        ...parentHueChain,
        ...siblingHues,
      ]);

      // this final child is highly visible when rendered
      siblingHues.push(finalChildHue);
    }

    finalHue = currentHue;
  }

  return finalHue;
}
function getRandHslForHue(hue: number): string {
  // sat between 30 and 70
  // light between 30 and 70
  const newSat = Math.random() * 20 + 60;
  const newLight = Math.random() * 20 + 40;

  return `hsl(${hue}, ${newSat}%, ${newLight}%)`;
}
function getColorThatAvoidsChain(hueChain: number[]): number {
  // find the hues that farthest apart and return the middle
  // this will help avoid collisions
  // sort the chain
  const copyHueChain = orderBy(uniq(hueChain));

  if (copyHueChain.length === 0) {
    return Math.floor(Math.random() * 360);
  }

  if (copyHueChain.length === 1) {
    // rotate 180 degrees
    return (copyHueChain[0] + 180) % 360;
  }

  // find the largest gap
  let largestGap = 0;
  let largestGapIndex = 0;

  for (let i = 0; i < copyHueChain.length; i++) {
    // consider wrap around at 360
    const gap =
      i === copyHueChain.length - 1
        ? copyHueChain[0] - copyHueChain[i] + 360
        : copyHueChain[i + 1] - copyHueChain[i];

    if (gap > largestGap) {
      largestGap = gap;
      largestGapIndex = i;
    }
  }

  // pick a random number in the middle fifth of the gap
  let newHue =
    copyHueChain[largestGapIndex] +
    (2 * largestGap) / 5 +
    (Math.random() * largestGap) / 5;

  if (newHue > 360) {
    newHue = newHue % 360;
  }

  // return the middle of the gap
  return newHue;
}
