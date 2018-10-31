import {State as AppState} from "modules/app";
import {State as PhotosState} from "modules/photos";
import {RootState} from "react-coat-pkg";

type State = RootState & AppState & PhotosState;
export default State;
