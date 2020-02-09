export class ResponseBody {
    success: boolean;
    body: any;
    constructor(success: boolean, body: any) {
        this.success = success;
        this.body = body;
    }
}