import {State as AppState} from "modules/app";
import {RootState} from "react-coat-pkg";

type State = RootState & AppState;
export default State;
