export default function IconButton({name, href, icon}){
    return(
        <div>
            <a href={href}>
                <span aria-label={name} role="img" aria-hidden="true" title={name}>
                    <svg
                        viewBox="0 0 1024 1024"
                        fill="white"
                        height="1.5em"
                        width="1.5em"
                        >
                        <path d={icon} />
                    </svg>
                </span>
            </a>
        </div>
    );
}