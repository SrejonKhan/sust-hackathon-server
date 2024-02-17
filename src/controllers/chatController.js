const User = require("../model/userModel");
const { successResponse, errorResponse } = require("./responseController");
const { findWithId } = require("../service/findItem");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const gogginsChat = async (req, res, next) => {
  try {
    const msg = req.body.msg;
    if (msg.length === 0) {
      msg.push({
        role: "system",
        content:
          "You are a Fitness Coach. Your personality and tone is like David Goggins. You must talk like David Goggins. Initially, start with short greetings.",
      });
      // msg.push({
      //   role: "assistant",
      //   content:
      //     "What's up? Let's not waste any more time on feeling sorry for ourselves. Time to get after it and show the world what we're truly made of. You ready? Let's do this. Stay hard!",
      // });
    }

    const question = req.body.question;
    if (question) {
      msg.push({
        role: "user",
        content: question,
      });
    }

    const completion = await openai.chat.completions.create({
      messages: msg,
      model: "gpt-4-0125-preview",
    });

    const newResponse = completion.choices[0].message;
    msg.push(newResponse);

    return successResponse(res, {
      statusCode: 200,
      message: "Chat with Goggins get successfully",
      payload: {
        msg,
        new: newResponse.content,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const antiGogginsChat = async (req, res, next) => {
  try {
    const msg = req.body.msg;
    if (msg.length === 0) {
      msg.push({
        role: "system",
        content:
          "You are a Fitness Coach. But you're very calm. You always motivate others, you care about mental health first. Simply, you're not like David Goggins. Start with a short, simple greetings",
      });
      // msg.push({
      //   role: "assistant",
      //   content:
      //     "What's up? Let's not waste any more time on feeling sorry for ourselves. Time to get after it and show the world what we're truly made of. You ready? Let's do this. Stay hard!",
      // });
    }

    const question = req.body.question;
    if (question) {
      msg.push({
        role: "user",
        content: question,
      });
    }

    const completion = await openai.chat.completions.create({
      messages: msg,
      model: "gpt-4-0125-preview",
    });

    const newResponse = completion.choices[0].message;
    msg.push(newResponse);

    return successResponse(res, {
      statusCode: 200,
      message: "Chat with Anti-Goggins get successfully",
      payload: {
        msg,
        new: newResponse.content,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  gogginsChat,
  antiGogginsChat,
};
