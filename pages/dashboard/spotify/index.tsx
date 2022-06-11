import SpotifyIcon from "$components/services/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTableWrapper from "$components/services/playlists/PlaylistTableWrapper";
import { Playlist, PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Spinner,
} from "@chakra-ui/react";
import { useGetRequest } from "$lib/clientRequest";
import { ssrRequireAuth } from "$lib/auth";
import { UserWithoutDatesAndPassword } from "$types/user";
import { getUserWithoutDatesAndPassword } from "$lib/db/user";
import { InferGetServerSidePropsType } from "next";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Index: Page<Props> = ({ user }: Props) => {
	const { loading, errorMessage, error, data } = useGetRequest<Playlist[]>(
		"/api/spotify/playlists",
	);

	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={14} w={14}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						{loading || !data ? (
							<Spinner></Spinner>
						) : (
							<PlaylistTableWrapper
								user={user}
								originService="spotify"
								playlists={data}></PlaylistTableWrapper>
						)}
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

export const getServerSideProps = ssrRequireAuth<{
	user: UserWithoutDatesAndPassword;
}>(async (_context, _session, sessionData) => {
	const user = await getUserWithoutDatesAndPassword(sessionData.user.id);

	if (!user) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			user,
		},
	};
});

Index.layout = DashboardLayout;

export default Index;
