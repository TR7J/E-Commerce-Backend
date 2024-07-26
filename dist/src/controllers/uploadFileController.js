"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileController = void 0;
const uploadFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = req.file
            ? /* req.file.path   */ `/uploads/${req.file.filename}`
            : "";
        res.status(200).json({ message: "Image added successfully", image });
    }
    catch (error) {
        console.error("Error adding image:", error);
        res.status(500).json({ message: "Error adding image", error });
    }
});
exports.uploadFileController = uploadFileController;
