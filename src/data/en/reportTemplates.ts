/**
 * English report templates — same rules as data/reportTemplates.ts.
 * Variables: {nameA} {nameB} {pair} {score} {grade} {typeLabel} {typeTitle}
 * Banned: destiny, soulmate, forever, always, never, breakup, bad luck, or any fortune-telling claim.
 */
import type { TypeCode } from "@/lib/analysis/types";

type TypeTemplates = {
  headline: string[];
  strength: string[];
  message: string[];
  story: string[][];
  petStory: string[][];
};

export const TYPE_TEMPLATES_EN: Record<TypeCode, TypeTemplates> = {
  SYNERGY: {
    headline: ["Two names that grow louder together", "Two names that open new possibilities"],
    strength: [
      "The biggest strength of {pair} is momentum. Just as one name ends and the other begins without a stumble, you pick up where the other leaves off.",
    ],
    message: [
      "When things click this easily, it is tempting to lean on each other for everything. Cheer on each other's solo moments, too. Coming back together will sound even better.",
    ],
    story: [
      [
        "Say {nameA}, and {nameB} follows before you even take a breath. Nothing gets in the way between these two names.",
        "Joined like that, the sound carries a little further than either name alone. {pair} might just be the kind of pair that goes that distance together.",
      ],
    ],
    petStory: [
      [
        "Call {nameA}, and {nameB} slips right in after, like two names that have always been said together.",
        "Days feel a little bigger when these two are side by side. {nameB} probably knew that already.",
      ],
    ],
  },
  RHYTHM: {
    headline: ["Two names walking to the same beat", "Two names that move in step"],
    strength: [
      "{pair} share a beat. When your pace and pauses match, nobody is left waiting for the other.",
    ],
    message: [
      "A shared rhythm is comforting, but the same beat on repeat can miss a new melody. Every now and then, try switching up the tempo together.",
    ],
    story: [
      [
        "{nameA}, {nameB}. Say them one after the other and you can hear the same beat in both.",
        "A shared rhythm creates moments that need no explanation. Maybe that is why conversations between {pair} feel so smooth.",
      ],
    ],
    petStory: [
      [
        "{nameA}, {nameB}. Call them back and forth and the two names move in step.",
        "Same walking pace, same nap time. The rhythm of their names matches the rhythm of their days.",
      ],
    ],
  },
  HARMONY: {
    headline: ["Two names that blend without trying", "Two sounds that mix naturally"],
    strength: [
      "The strength of {pair} is ease. Your names share a similar texture, so being together feels natural without any effort to match.",
    ],
    message: [
      "The more comfortable a bond gets, the less we say out loud. Even in the familiar, try saying thank you by name.",
    ],
    story: [
      [
        "{nameA} and {nameB}. Write them side by side and they look like one sentence from the start.",
        "Two sounds with the same texture ring together without drowning each other out. The harmony of {pair} is quiet, but it lingers.",
      ],
    ],
    petStory: [
      [
        "{nameA} and {nameB}. Written side by side, they look like names from the same family.",
        "Like their names, the picture of these two together just fits.",
      ],
    ],
  },
  COMPLEMENT: {
    headline: ["Two different names, one special rhythm", "Two names made whole by their differences"],
    strength: [
      "The strength of {pair} is that each has what the other lacks. Where one name leaves space, the other fills it in.",
    ],
    message: [
      "Differences can sometimes feel like misunderstandings. When the other's way feels unfamiliar, remember it is a sound your own name does not have.",
    ],
    story: [
      [
        "{nameA} and {nameB} start from different sounds. One rings one way, the other rings the opposite.",
        "So when they are said together, the range gets wider. Like two different notes forming a chord, {pair} are richer side by side.",
      ],
    ],
    petStory: [
      [
        "{nameA} and {nameB} have completely different sounds.",
        "Together they make the house sound more colorful. Two very different friends building one everyday life.",
      ],
    ],
  },
  BALANCE: {
    headline: ["Two names with likeness and difference in balance", "Two names that share the weight"],
    strength: [
      "The strength of {pair} is balance. You connect where you are alike and hold each other up where you differ.",
    ],
    message: [
      "Balance is not standing still; it is adjusting as you go. When things feel tipped to one side, try calling each other's name once more.",
    ],
    story: [
      [
        "{nameA} and {nameB} hold an even mix of shared and different sounds.",
        "Like two sides of a scale, when one gets heavy the other pushes a little harder. {pair} keep each other centered.",
      ],
    ],
    petStory: [
      [
        "{nameA} and {nameB} mix shared and different sounds in equal measure.",
        "Two friends who balance the day by carrying a little of it for each other.",
      ],
    ],
  },
};

export const TONE_IMAGE_EN: Record<string, string> = {
  "bright+bright": "Two bright tones overlap like a sunny afternoon.",
  "dark+dark": "Two deep tones meet like a quiet late-night talk.",
  "neutral+neutral": "Two clean, even tones meet like fresh white space.",
  "bright+dark": "Brightness meets depth like two colors bleeding into a sunset.",
  "bright+neutral": "A bright tone resting on a clean one feels like a crisp morning.",
  "dark+neutral": "A deep tone with a clean one feels like a still lake.",
};
