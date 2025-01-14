"use client"

import React, { useState, useRef, useEffect } from 'react'

import Link from 'next/link'
import addIcon from "../../images/add-circle-svgrepo-com.svg"
import novaLogo from "../../images/Logo.png"
import truck from "../../images/truck-semi-trailer-svgrepo-com.svg"
import sandClockIcon from "../../images/sand-clock-svgrepo-com.svg"
import deliveryTruckTime from "../../images/delivery-truck-time-svgrepo-com.svg"
import hamburgerIcon from "../../images/hamburger-menu.svg"
import closeHamburgerIcon from "../../images/close-hamburger-menu.svg"

import { Input } from '../Input'
import { LoadingAnimation } from '../LoadingAnimation'

import useScripts from './scripts'

import style from "./index.module.css"

function TopNavigation() {

    const {
        aguardandoApiEntregaFutura,
        aguardandoApiRomaneio,
        aguardandoApiVendas,
        handleCliqueBotaoAdicionarEntrega,
        handleCliqueBotaoGeraRomaneioEntrega,
        handleCliqueBotaoHamburgerMenu,
        handleCliqueOverlayMenu,
        isMenuClosed,
        romaneioCount
    } = useScripts()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Estado do menu suspenso
    const dropdownRef = useRef<HTMLDivElement>(null) // Referência ao menu suspenso

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

    // fecha o menu ao clicar fora do dropdown "Gestão"
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false)
        }
    }

    // Adicionar e remover o event listener que executa o "handleClickOutside"
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>

            {/* Barra de navegação Desktop */}
            <div className={style.navbar}>

                <img className={style.logo} src={novaLogo.src} alt="Logo" />

                <div className={style.adicionar_entrega_container}>
                    <Input placeholder={{ insideInput: true, text: "Adicionar entrega futura" }} inputType='text' fieldName='inputNumeroVenda' onPressReturnKey={() => { handleCliqueBotaoAdicionarEntrega("inputNumeroVenda") }} />
                    {
                        (aguardandoApiVendas || aguardandoApiEntregaFutura || aguardandoApiRomaneio)
                            ? <LoadingAnimation />
                            : <img className={style.icone_dicionar} src={addIcon.src} alt="Adicionar entrega futura" onClick={() => { handleCliqueBotaoAdicionarEntrega("inputNumeroVenda") }} />
                    }
                </div>

                <div className={style.adicionar_entrega_container}>
                    <Input placeholder={{ insideInput: true, text: "Gerar romaneio de entrega única" }} inputType='text' fieldName='inputNumeroVenda2' onPressReturnKey={() => { handleCliqueBotaoGeraRomaneioEntrega("inputNumeroVenda2") }} />
                    {
                        (aguardandoApiVendas || aguardandoApiEntregaFutura || aguardandoApiRomaneio)
                            ? <LoadingAnimation />
                            : <img className={style.icone_dicionar} src={addIcon.src} alt="Imprimir romaneio" onClick={() => { handleCliqueBotaoGeraRomaneioEntrega("inputNumeroVenda2") }} />
                    }
                </div>

                <Link href={"/painel/entregas-pendentes"}>Entregas pendentes</Link>
                <Link href={"/painel/consulta-romaneios"}>Romaneios</Link>
                
                {/* Item com novo menu suspenso */}
                <div className={style.dropdown_container} ref={dropdownRef}>
                    <div className={style.dropdown_toggle} onClick={toggleDropdown}>
                        <span>Gestão</span>
                    </div>
                    {isDropdownOpen && (
                        <div className={style.dropdown_menu}>
                            <Link href="/painel/produtos" className={style.dropdown_item} onClick={() => setIsDropdownOpen(false)}>Produtos</Link>
                            <Link href="/painel/vendas" className={style.dropdown_item} onClick={() => setIsDropdownOpen(false)}>Vendas</Link>
                            <Link href="/painel/contas-receber" className={style.dropdown_item} onClick={() => setIsDropdownOpen(false)}>Contas a Receber</Link>
                            <Link href="/painel/contas-pagar" className={style.dropdown_item} onClick={() => setIsDropdownOpen(false)}>Contas a Pagar</Link>
                        </div>
                    )}
                </div>

                <Link href={"/painel/romaneio"}>
                    <div className={style.icone_caminhao_container}>
                        <img className={style.icone_caminhao} src={truck.src} alt="Entregas" />
                        {
                            romaneioCount > 0 && <IconeQuantidadeEntregas quantidadeEntregas={romaneioCount} />
                        }
                    </div>
                </Link>

            </div>


            {/* Barra de navegação Mobile */}
            <div className={style.mobile_navbar}>

                <div className={style.hamburger_container} onClick={handleCliqueBotaoHamburgerMenu}>
                    <img src={hamburgerIcon.src} alt="" className={style.icone_hamburger} />
                </div>

                <img src={novaLogo.src} alt="" className={style.logo} />

                <Link href={"/painel/romaneio"}>
                    <div className={style.icone_caminhao_container}>
                        <img className={style.icone_caminhao} src={truck.src} alt="Entregas" />
                        {
                            romaneioCount > 0 && <IconeQuantidadeEntregas quantidadeEntregas={romaneioCount} />
                        }
                    </div>
                </Link>

                <div className={style.menu_overlay} is-closed={String(isMenuClosed)} id='menuOverlay' onClick={handleCliqueOverlayMenu}>
                    <div className={style.menu_container} id='menuContainer'>

                        <div className={style.mobile_menu_input_container}>
                            <p>Adicionar venda à entrega pendente</p>
                            <div className={style.adicionar_entrega_container}>
                                <Input placeholder={{ insideInput: true, text: "Nº venda" }} inputType='text' fieldName='inputNumeroVenda_mobile' />
                                {
                                    (aguardandoApiVendas || aguardandoApiEntregaFutura)
                                        ? <LoadingAnimation />
                                        : <img className={style.icone_dicionar} src={addIcon.src} alt="Adicionar entrega futura" onClick={() => { handleCliqueBotaoAdicionarEntrega("inputNumeroVenda_mobile") }} />
                                }
                            </div>
                        </div>

                        <div className={style.mobile_menu_input_container}>
                            <p>Gerar romaneio de entrega</p>
                            <div className={style.adicionar_entrega_container}>
                                <Input placeholder={{ insideInput: true, text: "Nº venda" }} inputType='text' fieldName='inputNumeroVenda2_mobile' />
                                {
                                    (aguardandoApiVendas || aguardandoApiRomaneio)
                                        ? <LoadingAnimation />
                                        : <img className={style.icone_dicionar} src={addIcon.src} alt="Imprimir romaneio" onClick={() => { handleCliqueBotaoGeraRomaneioEntrega("inputNumeroVenda2_mobile") }} />
                                }
                            </div>
                        </div>

                        <hr />

                        <Link href={"/painel/entregas-pendentes"} className={style.mobile_menu_link_container} onClick={handleCliqueBotaoHamburgerMenu}>
                            <img src={sandClockIcon.src} alt="" className={style.mobile_menu_link_icon} />
                            <span>Entregas pendentes</span>
                        </Link>

                        <Link href={"/painel/consulta-romaneios"} className={style.mobile_menu_link_container} onClick={handleCliqueBotaoHamburgerMenu}>
                            <img src={deliveryTruckTime.src} alt="" className={style.mobile_menu_link_icon} />
                            <span>Imprimir romaneios</span>
                        </Link>

                        <hr />

                        <Link href={"/painel/produtos"} className={style.mobile_menu_link_container} onClick={handleCliqueBotaoHamburgerMenu}>
                            {/* <img src={deliveryTruckTime.src} alt="" className={style.mobile_menu_link_icon} /> */}
                            <span>Produtos</span>
                        </Link>

                        <Link href={"/painel/vendas"} className={style.mobile_menu_link_container} onClick={handleCliqueBotaoHamburgerMenu}>
                            {/* <img src={deliveryTruckTime.src} alt="" className={style.mobile_menu_link_icon} /> */}
                            <span>Vendas</span>
                        </Link>

                        <div className={style.close_menu_button} onClick={handleCliqueBotaoHamburgerMenu} id='closeMenuButton'>
                            <img src={closeHamburgerIcon.src} alt="" className={style.close_hamburger_icon} />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

interface IIconeQuantidadeEntregasProps {
    quantidadeEntregas: number
}

function IconeQuantidadeEntregas({ quantidadeEntregas }: IIconeQuantidadeEntregasProps) {
    return (
        <div className={style.icone_quantidade_entregas}>
            <span>{quantidadeEntregas}</span>
        </div>
    )
}

export { TopNavigation }