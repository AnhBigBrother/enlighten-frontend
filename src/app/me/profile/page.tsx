import { UpdateProfileForm } from "@/components/forms/update-profile-form";
import { BACKEND_DOMAIN } from "@/constants";
import { TUserInfo } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const userData: TUserInfo = await fetch(`${BACKEND_DOMAIN}/api/v1/me`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})
		.then((res) => {
			if (!res.ok) {
				throw res;
			}
			return res.json();
		})
		.catch((err) => {
			redirect("/");
		});

	return (
		<div className='my-8 flex justify-center'>
			<UpdateProfileForm userData={userData} />
		</div>
	);
};

export default ProfilePage;
