import React from 'react'

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    UncontrolledTooltip
  } from "reactstrap";

export default props => {
    const tasks = [
        {
          title: 'Criar o jogo multiplayer offline',
          description: 'Desenvolver a versão inicial do jogo para multiplayer offline',
          completed: true
        },
        {
          title: 'Implementar single player',
          description: 'Implementação do singleplayer nível fácil, com movimentos randômicos.',
          completed: true
        },
        {
          title: 'Nível normal',
          description: 'Desenvolver lógica para o nível normal, com movimentos de defesa.',
          completed: true
        },
        {
          title: 'Nível Difícil',
          description: 'Implementar o nível difícil, com movimentos de defesa e ataque.',
          completed: true
        },
        {
          title: 'Aplicar tema free',
          description: 'Utilizar um tema free para melhorar o layout geral da aplicação.',
          completed: true
        },
        {
          title: 'Ajustar o jogo ao novo tema',
          description: 'Ajustes gerais de navegação e adaptação do tema para o jogo.',
          completed: true
        },
        {
          title: 'Lista de tarefas mock',
          description: 'Desenvolver a lógica para tornar esta lista de tarefas dinâmica, mesmo estando ainda mockada.',
          completed: true
        },
        {
          title: 'Lista de tarefas persistente',
          description: 'Desenvolver a persistência desta lista de tarefas.',
          completed: false
        },
        {
          title: 'Novo nível Difícil',
          description: 'Passar o nível difícil para o médio e desenvolver uma nova lógica para o nível difícil',
          completed: true
        },
        {
          title: 'Placar',
          description: 'Implementar o placar.',
          completed: true
        },
        {
          title: 'Animações',
          description: 'Adicionar animações aos botões',
          completed: true
        },
        {
            title: 'Corrigir restart singleplayer',
            description: 'Identificar e corrigir bugs no restart',
            completed: true
        },
        {
          title: 'Multiplayer Online',
          description: 'Implementar o multiplayer online',
          completed: false
        },
        {
          title: 'Notificações',
          description: 'Implementar mensagens como notificações',
          completed: false
        }
      ]

    return (
        <Card className="card-tasks">
            <CardHeader>
                <h6 className="title d-inline">Tarefas({tasks.length})</h6>
                {/* <p className="card-category d-inline"> today</p> */}
                {/* <UncontrolledDropdown>
                <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                >
                    <i className="tim-icons icon-settings-gear-63" />
                </DropdownToggle>
                <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                    >
                    Action
                    </DropdownItem>
                    <DropdownItem
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                    >
                    Another action
                    </DropdownItem>
                    <DropdownItem
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                    >
                    Something else
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown> */}
            </CardHeader>
            <CardBody>
                <div className="table-full-width table-responsive">
                <Table>
                    <tbody>
                    {tasks.reverse().map(task => { 
                        return (
                        <tr>
                            <td>
                            <FormGroup check>
                                <Label check>
                                    {task.completed ? 
                                    <Input defaultChecked defaultValue="" type="checkbox" /> : 
                                    <Input defaultValue="" type="checkbox" />
                                    }
                                    
                                <span className="form-check-sign">
                                    <span className="check" />
                                </span>
                                </Label>
                            </FormGroup>
                            </td>
                            <td>
                            <p className={`title ${task.completed ? 'striked' : ''}`}>{task.title}</p>
                            <p className={`text-muted ${task.completed ? 'striked' : ''}`}>
                                {task.description}
                            </p>
                            </td>
                            <td className="td-actions text-right">
                            <Button
                                color="link"
                                id="tooltip457194718"
                                title=""
                                type="button"
                            >
                                <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                                delay={0}
                                target="tooltip457194718"
                                placement="right"
                            >
                                Editar
                            </UncontrolledTooltip>
                            </td>
                        </tr>
                        )
                    })}
                    </tbody>
                </Table>
                </div>
            </CardBody>
            </Card>
    )
}