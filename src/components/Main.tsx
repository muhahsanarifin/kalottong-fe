import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useToggle } from "usehooks-ts";
import { getCookie } from "cookies-next";

import { InputTask, InputEditTask } from "./Input";
import { OngoingTasks, DoneTasks } from "./Task";
import { SortingDropDown } from "./Forms";
import {
  AddTaskButton,
  DoneTaskButton,
  SortingButton,
  RenameButton,
  ResetButton,
} from "./Button";
import { WelcomeMessage } from "./Feed";
import { Paginations } from "./Pagination";
import { taskAction } from "@/redux/reducers/tasks";

const Main = () => {
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch();
  const [hidden, toggle] = useToggle();
  const [hiddenAddTask, setHiddenAddTask] = useState(false);
  const [hiddenDoneTask, setHiddenDoneTask] = useState(false);
  const [accessToken, setAccessToken] = useState<any>(getCookie("token"));
  const [sort, setSort] = useState("");
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState("ongoing");
  const [limit, setLimit] = useState<number>(5);
  const doneTasks = useSelector(
    (state: RootState) => state.tasks.retriveDoneTasks.data.data
  );
  const dataToRename = useSelector(
    (state: RootState) => state.confirm.taskDataToRename
  );
  const ongoingTasks = useSelector(
    (state: RootState) => state.tasks.retriveOngoingTasks.data
  );

  return (
    <>
      <main className="min-h-screen flex flex-col">
        <div className="shadow-[0_16px_90px_rgba(19,7,52,0.08)] rounded-[12px] w-[80%] min-h-[42rem] m-auto p-[2.5rem]">
          <div className="h-[100%] flex flex-col gap-y-2">
            {!accessToken ? (
              <WelcomeMessage />
            ) : (
              <>
                <section className="flex items-center">
                  <div className="flex flex-col">
                    <p className="text-red-orange font-medium text-[16px]">
                      MY TASK
                    </p>
                    <h1 className="text-[24px] font-medium text-cyan-blue">
                      To Do List
                    </h1>
                    <p className="text-[#7A7F83] font-normal text-[16px]">
                      Buat list tugas harian saya
                    </p>
                  </div>
                  <div className="ml-auto">
                    {dataToRename?.isFulfilled && (
                      <RenameButton init="Rename Task" />
                    )}
                    {!dataToRename?.isFulfilled && (
                      <AddTaskButton
                        onSetToggle={() => setHiddenAddTask(!hiddenAddTask)}
                        init="Tambah Tugas"
                      />
                    )}
                  </div>
                </section>
                <section>
                  <div className="flex items-center">
                    <p className="text-[#7A7F83] font-medium text-[16px]">
                      Sort By
                    </p>
                    <div className="ml-auto relative">
                      <SortingButton onSetToggle={toggle} onHidden={hidden} />
                      <SortingDropDown onHidden={hidden} onSetSort={setSort} />
                    </div>
                  </div>
                  {sort && (
                    <ResetButton
                      title="Reset"
                      onsetReset={() => window.location.reload()}
                    />
                  )}
                </section>
                {hiddenAddTask && (
                  <section className="p-2 bg-[#F5F5F5]">
                    <InputTask />
                  </section>
                )}
                {dataToRename?.isFulfilled && (
                  <section className="p-2 bg-[#F5F5F5]">
                    <InputEditTask
                      onBody={dataToRename?.data}
                      isFulfilled={dataToRename?.isFulfilled}
                    />
                  </section>
                )}
                <section>
                  <div className="p-2 flex flex-col gap-y-2">
                    <OngoingTasks onSort={sort} onPage={page} />
                    {ongoingTasks?.totalPages === null ? null : (
                      <Paginations onSetPage={setPage} onPage={page} />
                    )}
                  </div>
                  <div className="border-t-2 border-t-solid border-t-[#CCCED2] pt-2">
                    <div className="flex items-center gap-x-2">
                      <DoneTaskButton
                        onSetToggle={() => setHiddenDoneTask(!hiddenDoneTask)}
                        onHidden={hiddenDoneTask}
                      />
                      <span className="flex items-center gap-x-2">
                        <p className="text-[#7A7F83] font-[500]">
                          Terselesaikan
                        </p>
                        <p className="text-[#7A7F83] font-[500]">
                          {doneTasks?.length && `${doneTasks?.length} Tugas`}
                        </p>
                      </span>
                    </div>
                  </div>
                  <div className={!hiddenDoneTask ? "hidden" : "p-2"}>
                    <DoneTasks />
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
