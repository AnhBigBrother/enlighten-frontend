import { Fetch } from "@/actions/fetch";
import MyProfile from "@/components/my-profile";
import { TUserInfo } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
	const cookieStore = await cookies();
	const userData: TUserInfo = await Fetch("api/v1/user/me", "GET", {
		authorization: `Bearer ${cookieStore.get("access_token")?.value}`,
	}).catch((err) => redirect("/login"));

	return <MyProfile userData={userData} />;
};

export default ProfilePage;
