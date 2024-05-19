type Props = {
    imgString: string;
    onChange: (value: string)=>void;
    options?: string[];
}

export function Graph(props: Props): React.JSX.Element {
    const handleInputValue: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      props.onChange(e.target.value);
    };
    return (
        <div>
            <select onChange={handleInputValue}>
                {props.options?.map(option => (<option>{option}</option>))}
            </select>
            <div className={"graph_box"}>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(props.imgString)}`}/>
            </div>
        </div>
    );
}