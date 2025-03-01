import { GetMe } from "@/actions/grpc/user";
import { UpdateProfileForm } from "@/components/forms/update-profile-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const userData = await GetMe()
		.then((res) => {
			if (!res.data || res.error) {
				throw res.error;
			}
			return res.data!;
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
