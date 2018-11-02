import {State as AppState} from "modules/app/facade";
import {State as PhotosState} from "modules/photos/facade";
import {RootState} from "react-coat-pkg";

type State = RootState & AppState & PhotosState;
export default State;
