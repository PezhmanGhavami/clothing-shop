import { Request, Response, NextFunction } from "express";

export interface IExpressEndpointHandler {
  (req: Request, res: Response, next: NextFunction): void;
}
