import MyProfile from "@/components/my-profile";
import { _get } from "@/lib/fetch";
import { TUserInfo } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
	const cookieStore = await cookies();
	const userData: TUserInfo = await _get("api/v1/user/me", {
		authorization: `Bearer ${cookieStore.get("access_token")?.value}`,
	}).catch((err) => {
		console.error(err);
		redirect("/login");
	});

	return <MyProfile userData={userData} />;
};

export default ProfilePage;
