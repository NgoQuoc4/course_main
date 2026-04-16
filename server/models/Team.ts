import mongoose, { Schema, Document } from "mongoose";

export interface ITeamSocialLinks {
    facebook?: string;
    linkedin?: string;
    github?: string;
    website?: string;
}

export interface ITeam {
    name: string;
    position?: string;
    avatar?: string;
    description?: string;
    socialLinks?: ITeamSocialLinks;
    order: number;
    isActive: boolean;
}

export interface ITeamDocument extends ITeam, Document {
    _id: any;
}

const teamSchema = new Schema<ITeamDocument>(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên"],
            trim: true,
        },
        position: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        socialLinks: {
            facebook: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            website: { type: String, default: "" },
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITeamDocument>("Team", teamSchema);
