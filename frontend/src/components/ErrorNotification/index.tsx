// styles
import "./styles.css";

interface IProps {
    errors: string[];
}

const ErrorNotification: React.FC<IProps> = (props: IProps) => {
    if (!props.errors.length) {
        return null;
    }

    return <div className="errorNotification">{props.errors[0]}</div>;
};

export default ErrorNotification;
