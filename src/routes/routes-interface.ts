import * as express from "express";

export interface Routes {
    routes(expressApp: express.Application)
}