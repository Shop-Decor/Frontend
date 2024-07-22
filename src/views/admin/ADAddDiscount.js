import React from 'react';
import axios from "axios";

class ADAddDiscount extends React.Component {
    state
    render() {
        return (
            <>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Tên</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" name="name" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Mo ta</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" name="text" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Ảnh</label>
                                        <div className="col-sm-8">
                                            <input className="form-control" name="file" type="file" />
                                            <span className="text-danger"></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ADAddDiscount;