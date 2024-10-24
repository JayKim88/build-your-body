"use server";

import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "../auth/[...nextauth]/authOptions";
import { RegisteredProgram } from "../types";

type getProgramsProps = {
  id?: string;
  includeDeleted?: boolean;
};

async function getData(props?: getProgramsProps) {
  const { id, includeDeleted } = props ?? {};
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const result = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/programs`, {
        params: {
          email: session.user?.email,
          id,
          includeDeleted,
        },
      })
      .then((res) => res.data);

    let formattedData: RegisteredProgram | RegisteredProgram[];

    if (Array.isArray(result.data)) {
      formattedData = (result.data as RegisteredProgram[])?.map(
        ({ _id, userId, ...rest }) => ({
          ...rest,
          _id: _id.toString(),
          userId: userId.toString(),
        })
      );
    } else {
      const { _id, userId, ...rest } = result.data ?? {};
      formattedData = {
        ...rest,
        _id: _id?.toString(),
        userId: userId?.toString(),
      };
    }

    return formattedData;
  } catch (error) {
    console.log("fetch failed", error);
    return null;
  }
}

export { getData as getPrograms };
