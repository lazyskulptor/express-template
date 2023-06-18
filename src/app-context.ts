import { repoContext } from "./repo/repo-context";
import MemberService from "./service/MemberService";

type AppContext = {
  memSvc: MemberService;
};
const context = {} as AppContext;
const ctx = () => {
  context.memSvc = context.memSvc ?? new MemberService(
    repoContext().memRepo,
    repoContext().authRepo
  );

  return context;
};

export default ctx;
