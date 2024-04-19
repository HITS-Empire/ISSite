import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu() {
    return (
        <MenuWrapper
            title="Базовый генетический алгоритм"
            description="Сейчас вы узрите, как работает алгоритм нахождения кратчайшего пути в задаче коммивояжёра."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={() => {}}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={() => {}}
                >
                    Перезагрузить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
