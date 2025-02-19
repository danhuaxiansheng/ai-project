export const WORLD_TEMPLATES = {
  fantasy: {
    name: "奇幻世界",
    description: "包含魔法、神秘生物和史诗冒险的奇幻世界模板",
    geography: {
      regions: [
        {
          id: "central-kingdom",
          name: "中央王国",
          description: "人类文明的中心，繁荣的城邦联盟",
          climate: "温带",
          terrain: "平原与丘陵",
          resources: ["铁矿", "农田", "森林"],
          cultures: [],
        },
        {
          id: "elven-forest",
          name: "精灵森林",
          description: "古老的精灵族聚居地，充满神秘的魔法能量",
          climate: "温润",
          terrain: "原始森林",
          resources: ["魔法水晶", "珍稀药草", "古木"],
          cultures: [],
        },
      ],
      climate: {
        type: "diverse",
        features: ["四季分明", "魔法影响"],
      },
      resources: ["魔法水晶", "珍稀金属", "神秘药草"],
    },
    society: {
      cultures: [
        {
          id: "human-kingdom",
          name: "人类王国文化",
          description: "注重进取与创新的人类文明",
          values: ["荣誉", "进步", "团结"],
          customs: ["骑士精神", "商会制度", "贵族礼仪"],
          languages: ["通用语", "古代语"],
          regions: ["central-kingdom"],
        },
      ],
      politics: {
        type: "monarchy",
        features: ["世袭制度", "贵族议会", "行会制度"],
      },
      economy: {
        type: "feudal",
        features: ["农业基础", "手工业发展", "魔法贸易"],
      },
    },
    powerSystem: {
      type: "magic",
      rules: [
        {
          id: "elemental-magic",
          name: "元素魔法",
          description: "控制自然元素的基础魔法体系",
          effects: ["火焰操控", "水流掌握", "大地之力", "风之术"],
          costs: ["魔力消耗", "精神负担"],
          limitations: ["元素亲和度要求", "施法时间限制"],
        },
      ],
      limitations: ["魔力限制", "施法材料需求", "自然法则约束"],
      artifacts: [
        {
          id: "crystal-staff",
          name: "水晶法杖",
          description: "增幅魔法力量的神器",
          type: "魔法工具",
          powers: ["魔力增幅", "元素亲和"],
          origin: "远古精灵文明",
          relatedRules: ["elemental-magic"],
        },
      ],
    },
  },
  // 可以添加更多模板
};
