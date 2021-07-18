import { Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDocument } from "../types/userTypes";
import { sendEmail } from "../utils/mail";

export const createUserController = async (req: Request, res: Response) => {
  console.log("SignUp Request");
  //Validate User
  try {
    const { email, password, expoToken } = req.body;
    const idExists = await User.findOne({ email });
    //console.log(idExists);
    if (idExists) return res.status(400).json({ msg: "User already exists" });

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new User
    const user: UserDocument = {
      email,
      password: hashPassword,
      expoToken,
    };

    const resp = await User.create(user);

    console.log(user, resp);

    const emailConfig = {
      subject: "Welcome to Notime",
      text: `Your Github webhook : https://noti-me.herokuapp.com/webhook/github/${resp._id} `,
      to: email,
      from: process.env.EMAIL,
    };

    // Sending webhook to user
    await sendEmail(emailConfig);

    return res.json({ msg: "User succesfully created" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Internal Server Error" });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Checking if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials !!!" });

    // Checking if Password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ msg: "Invalid Credentials !!!" });

    //Create and Sign JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET || "notimy",
      {
        expiresIn: "7d",
      }
    );
    res.json({ token: token });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Internal Server Error" });
  }
};

export const getUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, { password: 0 }).populate(
      "messages"
    );

    if (user) {
      res.json(user);
    } else {
      res.json({ msg: "Invalid user ID" });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Internal Server Error" });
  }
};
