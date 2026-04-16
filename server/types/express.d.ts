import { ICustomerDocument } from "../models/Customer.js";

declare global {
    namespace Express {
        interface Request {
            customer?: ICustomerDocument;
        }
    }
}
