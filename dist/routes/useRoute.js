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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../services/authenticate"));
const router = (0, express_1.Router)();
router.get("/profile", authenticate_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req; // ✅ Type assertion
    const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
    res.json({ userId });
}));
exports.default = router;
