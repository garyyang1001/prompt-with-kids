// src/lib/learning/toddler-adventure-template.ts

export interface ToddlerStage {
  id: string; // e.g., "character", "place"
  order: number; // 1, 2, 3...
  title: string; // Full title, e.g., "我們的主角"
  simpleTitle: string; // Shorter title for UI, e.g., "主角"
  description: string; // Brief explanation of the stage
  educationalGoal: string; // What the child learns
  childPrompt: string; // Prompt directed at the child
  parentGuidance: string; // Guidance for the parent
  visualCues: string[]; // Keywords for image generation, e.g., ["character", "happy"]
  suggestions: string[]; // Example answers or ideas
  timeEstimate: number; // Estimated minutes for this stage
  interactionType: 'choice' | 'open_ended' | 'visual_creation'; // Type of interaction
}

export interface ToddlerAdventureTemplate {
  id: string; // Unique ID for the template, e.g., "toddler_adventure"
  name: string; // Template name, e.g., "今天的小冒險"
  description: string; // Brief description of the template
  targetAge: [number, number]; // Recommended age range, e.g., [3, 6]
  estimatedTime: number; // Total estimated time in minutes
  visualSupport: boolean; // Does this template rely heavily on visuals?
  parentRole: 'primary' | 'secondary' | 'observer'; // Role of the parent
  stages: ToddlerStage[]; // Array of stages
}

export const toddlerAdventureTemplateData: ToddlerAdventureTemplate = {
  id: 'toddler_adventure',
  name: '今天的小冒險',
  description: '和寶貝一起創造簡單有趣的故事',
  targetAge: [3, 6],
  estimatedTime: 15, // Total estimated time in minutes
  visualSupport: true,
  parentRole: 'primary',
  stages: [
    {
      id: 'character',
      order: 1,
      title: '我們的主角',
      simpleTitle: '主角',
      description: '選擇或創造一個可愛的主角。',
      educationalGoal: '引導孩子認識不同的動物或人物，並進行簡單的選擇。',
      childPrompt: '寶寶看，我們今天故事裡的小主角是誰呢？你喜歡小兔子、小熊熊，還是其他小動物？',
      parentGuidance: `給孩子看一些動物圖片，或者直接問他們喜歡哪個。
如果孩子有自己喜歡的玩具，也可以讓玩具當主角。
鼓勵孩子說出動物的名字，或者模仿動物的叫聲。`,
      visualCues: ['cute animal', 'main character', 'happy expression'],
      suggestions: ['小兔子', '小熊熊', '小貓咪', '勇敢的消防員'],
      timeEstimate: 3,
      interactionType: 'choice',
    },
    {
      id: 'place',
      order: 2,
      title: '要去哪裡玩',
      simpleTitle: '地點',
      description: '決定主角要去的地方。',
      educationalGoal: '幫助孩子了解不同的場所和環境。',
      childPrompt: '那[主角名字]今天要去哪裡玩呢？是去公園溜滑梯，還是去沙灘玩沙沙？',
      parentGuidance: `可以提供幾個孩子熟悉的選項，比如公園、遊樂場、沙灘、森林等。
用圖片輔助孩子理解不同的地點。
引導孩子描述一下這個地方有什麼，比如公園有花有草有溜滑梯。`,
      visualCues: ['fun place', 'playground', 'beach', 'forest'],
      suggestions: ['公園', '沙灘', '森林裡', '遊樂園'],
      timeEstimate: 3,
      interactionType: 'choice',
    },
    {
      id: 'activity',
      order: 3,
      title: '要做什麼事',
      simpleTitle: '做什麼',
      description: '描述主角在做什麼有趣的活動。',
      educationalGoal: '擴展孩子的動詞詞彙，並理解簡單的活動。',
      childPrompt: '太棒了！那[主角名字]在[地點名稱]做什麼好玩的事情呢？是在堆沙堡，還是盪鞦韆？',
      parentGuidance: `根據選擇的地點，提供一些合適的活動選項。
鼓勵孩子模仿動作，比如假裝在盪鞦韆或者堆沙堡。
如果孩子有自己的想法，就順著他們的話題發展。`,
      visualCues: ['playing', 'activity', 'fun action'],
      suggestions: ['堆沙堡', '盪鞦韆', '找果子', '溜滑梯'],
      timeEstimate: 3,
      interactionType: 'open_ended',
    },
    {
      id: 'little_problem',
      order: 4,
      title: '遇到小麻煩',
      simpleTitle: '小麻煩',
      description: '故事中出現一個小小的困難。',
      educationalGoal: '初步培養孩子面對問題和思考解決方案的能力。',
      childPrompt: '哎呀，[主角名字]在[做什麼]的時候，好像遇到一點小麻煩了！發生什麼事了呢？',
      parentGuidance: `設計一個非常簡單、符合孩子認知水平的小問題。
比如：小兔子找不到胡蘿蔔了；小熊的球滾遠了。
避免太複雜或嚇到孩子的情節。重點是引導他們思考“怎麼辦”。`,
      visualCues: ['little problem', 'oops', 'confused face'],
      suggestions: ['找不到東西了', '球滾走了', '突然下雨了'],
      timeEstimate: 3,
      interactionType: 'open_ended',
    },
    {
      id: 'happy_solution',
      order: 5,
      title: '開心解決了',
      simpleTitle: '解決了',
      description: '主角成功解決了小麻煩。',
      educationalGoal: '給予孩子積極的反饋，體驗解決問題的快樂。',
      childPrompt: '哇！那[主角名字]是怎麼解決[小麻煩]的呢？後來怎麼樣了？',
      parentGuidance: `引導孩子想出一個簡單的解決方法。
家長可以給予提示，比如“是不是可以找媽媽幫忙？”或者“用小手把它撿回來好不好？”
強調問題解決後的開心結局，讓孩子有成就感。`,
      visualCues: ['happy ending', 'problem solved', 'smiling'],
      suggestions: ['媽媽幫忙找到了', '自己撿回來了', '雨停了，出現彩虹'],
      timeEstimate: 3,
      interactionType: 'open_ended',
    },
  ],
};
