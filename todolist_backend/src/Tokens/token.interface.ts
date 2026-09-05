import { TokenType } from "./tokens.entity.js";

export interface IToken {
  id: number;
  email: string;
  token: string;
  type: TokenType;
  created_at: Date;
  updated_at: Date;
}