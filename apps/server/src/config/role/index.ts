import { Role } from "../../models/Role";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

interface RoleConfig {
  name: string;
  settings: {
    creativity: number;
    strictness: number;
    speed: number;
    style: string[];
    constraints: string[];
  };
}

export function loadRoleConfig(type: Role["type"]): RoleConfig {
  const configPath = path.join(__dirname, `${type}.yml`);
  const configFile = fs.readFileSync(configPath, "utf8");
  return yaml.load(configFile) as RoleConfig;
}
