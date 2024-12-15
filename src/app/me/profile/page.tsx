import MyProfile from "@/components/my-profile";
import { BACKEND_DOMAIN } from "@/constants";
import { TUserInfo } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token");
	console.log(access_token);
	const userData: TUserInfo = await fetch(`${BACKEND_DOMAIN}/api/v1/user/me`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			redirect("/login");
		});

	return <MyProfile userData={userData} />;
};

export default ProfilePage;
