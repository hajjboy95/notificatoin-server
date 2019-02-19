import {Request, Response } from 'express';

export class JsonResponseStructure  {

    public static retJson<T>(code: string, data: T, message: string, messageDetail: MessageDetail, success: boolean, total: number): {} {
        return {
            code: code,
            data: data,
            message: message,
            messageDetail: messageDetail,
            success: success,
            total: total
        };
    }
}

class MessageDetail {
    action: string
    icon: string
    title: string
    type: string

    constructor(action: string, icon: string, title: string, type: string) {
        this.action = action;
        this.icon = icon;
        this.title = title;
        this.type = type
    }
}


export class IndexController {

    constructor() {
        console.log("index controller inititialized");
    }

    public rootIndex(req: Request, res: Response) {
        res.json({
            message: "Amina 😘"
        });
    }
}
