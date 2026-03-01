import { Context } from "koa";
import { analyzeImage } from "../services/gemini";

export default {
  async analyze(ctx: Context) {
    const file = ctx.request.files?.image;

    if (!file) {
      return ctx.badRequest("No image uploaded");
    }

    // handle array or single file
    const fileData = Array.isArray(file) ? file[0] : file;

    const filePath = fileData.filepath;

    try {
      const result = await analyzeImage(filePath);

      return ctx.send({
        success: true,
        result,
      });
    } catch (error: any) {
      console.log("Image analysis error:", error);

      return ctx.internalServerError("Failed to analyze image", {
        error: error.message,
      });
    }
  },
};
