import { Box, Typography } from "@mui/material";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { changeUser } from "../../redux/feature/chatSlice";
const UsersChats: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state?.auth?.user);

  const [chat, setChat] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChat", currentUser?.uid), (doc) => {
        // @ts-ignore
        setChat(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleChat = (data: any) => {
    dispatch(changeUser({ user: data, currentUser: currentUser }));
  };

  return (
    <Box style={{ height: "calc(100vh - 253px)", overflowY: "auto" }}>
      {Object.entries(chat)
      // @ts-ignore
       ?.sort((a, b) => b[1].date - a[1].date)
        ?.map((value: any) => {
          return (
            <button
              onClick={() => handleChat(value[1]?.userInfo)}
              key={value[0]}
              className="flex gap-7 items-center py-5 border-b border-[#EDEDED]  w-full"
              // onClick={handleSelect}
            >
              <Box>
                <Typography
                  className="rounded-full w-[50px] h-[50px]"
                  component={"img"}
                  src={value[1]?.userInfo?.photoURl}
                ></Typography>
              </Box>
              <Box className="flex flex-col items-start">
                <Typography className="font-semibold">
                  {value[1]?.userInfo?.displayName}
                </Typography>
                <Typography>
                  {value[1]?.lastMessage?.text
                    ? value[1]?.lastMessage?.text.slice(0, 20) + "..."
                    : ""}
                </Typography>
              </Box>
            </button>
          );
        })}
    </Box>
  );
};

export default UsersChats;
